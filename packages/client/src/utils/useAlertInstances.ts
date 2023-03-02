import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { usePageVisibility } from 'react-page-visibility'

import type { AlertInstance } from '../types'

const useAlertInstances = (userAddress: string | null) => {

  const [alertInstances, setAlertInstances] = useState<{[key: number]: AlertInstance[]}>({})
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(Notification.permission === 'granted')
  const [activeNotifications, setActiveNotifications] = useState<{[key: number]: Notification}>({})
  const isPageVisible = usePageVisibility()
  const { sendMessage, readyState } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET as string, { 
      protocols: 'echo-protocol',
      onError: console.error,
      shouldReconnect: (closeEvent) => true,
      onMessage: (e) => handleIncomingAlert(e.data)
    }
  )

  const handleIncomingAlert = (msg: string) => {
    if(msg === userAddress) {
      console.info(`Listening alerts for user ${userAddress}`)
      return
    } 
    const { edition_id, ...newInstance }: { edition_id: number } & AlertInstance = JSON.parse(msg)
    console.info(`Incoming alert for Edition '${edition_id}'`, newInstance)
    
    const pendingInstances = [
      newInstance,
      ...(alertInstances[edition_id] ?? [])
    ]
    // store in state
    setAlertInstances({
      ...alertInstances,
      [edition_id]: pendingInstances
    })

    if (notificationsEnabled && !isPageVisible) {
      // duplicate as browser notification
      let body: string
      // Despite the previous call to setAlertInstances, alertInstances state has not yet been updated
      if (pendingInstances.length === 1) {
        body = `has been listed for ${newInstance.sale_price} $`
      } else {
        const lowestPrice = pendingInstances.reduce((acc, notif) => Math.min(acc, notif.sale_price), +Infinity)
        body = `has been listed ${pendingInstances.length} times for a lowest price of ${lowestPrice} $`
      }
      const notification = new Notification(
        `Edition ${edition_id}`,
        {
          body,
          tag: edition_id.toString()
        }
      )
      setActiveNotifications({ ...activeNotifications, [edition_id]: notification })
    }
  }

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled && Notification.permission !== 'granted') {
      await Notification.requestPermission()
    }
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(!notificationsEnabled)
    } else {
      setNotificationsEnabled(false)
    }
  }

  const handleFlush = (edition_id: number) => {
    const copy = { ...alertInstances }
    delete copy[edition_id]
    setAlertInstances(copy)
  }
  
  const handleFlushAll = () => {
    setAlertInstances({})
  }

  useEffect(() => {
    if (isPageVisible) {
      Object.values(activeNotifications).forEach((notification) => notification.close())
      setActiveNotifications({})
    } 
  }, [isPageVisible])

  useEffect(() => {
    if (userAddress !== null && readyState === ReadyState.OPEN) {
      // asks the servers to send alerts 
      sendMessage(userAddress)
    }
  }, [userAddress, readyState])

  return {
    alertInstances,
    notificationsEnabled,
    onToggleNotifcations: handleToggleNotifications,
    onFlushEdition: handleFlush,
    onFlushAll: handleFlushAll
  }

}

export default useAlertInstances