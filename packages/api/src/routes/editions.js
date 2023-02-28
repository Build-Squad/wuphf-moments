import express from 'express';

function initEditionsRouter(EditionsService) {
  const router = express.Router();

  router.get('/editions/:edition_id/listings', async (req, res) => {
    const sales =
      await EditionsService.getListingsForEdition(parseInt(req.params.edition_id));

    return res.status(200).send({ sales });
  });

  router.get('/editions/:edition_id/sales', async (req, res) => {
    const sales =
      await EditionsService.getSalesForEdition(parseInt(req.params.edition_id));

    return res.status(200).send({ sales });
  });

  return router;
}

export default initEditionsRouter;
