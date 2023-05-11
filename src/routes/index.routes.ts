import client from '../fhir/client.config';
import {NextFunction, Request, Response, Router} from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to Ayush HRS');
});

// GET all resources of a type (e.g. Patient, Practitioner, etc.)
// returned as a Bundle
router.get(
  '/resource/:type',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {type} = req.params as {type: string};
      const resourceType =
        type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      console.log(resourceType);
      const resource = await client.search({resourceType});
      res.json(resource);
    } catch (err: any) {
      // res.status(err.response.status).json(err);
      next(err);
    }
  }
);

// GET a resource by id
// returned as a Bundle
router.get(
  '/resource/:type/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id, type} = req.params as {
        type: string;
        id: string;
      };
      console.log(id, type);
      const resourceType =
        type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      const resource = await client.read({resourceType, id});
      // const resource = await client.search({
      //   resourceType,
      //   // searchParams: {
      //   //   _id: id,
      //   // },
      // });
      res.status(200).json(resource);
    } catch (err: any) {
      // res.status(err.response.status).json(err);
      next(err);
    }
  }
);

router.post(
  '/resource',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {body} = req;
      const resourceType =
        body.resourceType.charAt(0).toUpperCase() +
        body.resourceType.slice(1).toLowerCase();
      const resource = await client.create({
        resourceType,
        body: req.body,
      });
      res.status(201).json(resource);
    } catch (err: any) {
      // res.status(err.response.status).json(err);
      next(err);
    }
  }
);

router.put(
  '/resource/:type/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id, type} = req.params as {
        type: string;
        id: string;
      };
      const resourceType = type.charAt(0).toUpperCase() + type.slice(1);
      const resource = await client.update({
        resourceType,
        id,
        body: req.body,
      });
      res.status(200).json(resource);
    } catch (err: any) {
      // res.status(err.response.status).json(err);
      next(err);
    }
  }
);

router.delete(
  '/resource/:type/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id, type} = req.params as {
        type: string;
        id: string;
      };
      const resourceType = type.charAt(0).toUpperCase() + type.slice(1);
      const resource = await client.delete({
        resourceType,
        id,
      });
      res.status(200).json(resource);
    } catch (err: any) {
      // res.status(err.response.status).json(err);
      next(err);
    }
  }
);

export default router;
