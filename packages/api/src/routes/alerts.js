import express from 'express';

function initAlertsRouter(AlertsService) {
  const router = express.Router();

  router.get('/alerts/:address', async (req, res) => {
    const alerts =
      await AlertsService.getAlertsForAddress(req.params.address);

    return res.status(200).send({ alerts });
  });

  router.post('/alerts/', async (req, res) => {
    const result =
      await AlertsService.createNewAlert(req.body);

    return res.status(200).send({ result });
  });

  router.delete('/alerts/:edition_id/:address', async (req, res) => {
    const result =
      await AlertsService.deleteAlert(req.params.edition_id, req.params.address);

    return res.status(200).send({ result });
  });

  return router;
}

export default initAlertsRouter;
