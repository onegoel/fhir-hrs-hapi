import client from '../fhir/client.config';
import {NextFunction, Request, Response, Router} from 'express';
const router = Router();
import * as fhir4 from 'fhir/r4';

router.get('/', (req, res) => {
  res.send('Welcome to Ayush HRS');
});

router.get('/meta', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const meta = await client.capabilityStatement();
    res.json(meta);
  } catch (err: any) {
    // res.status(err.response.status).json(err);
    next(err);
  }
});

// GET all supported resources
router.get('/meta/resources', async (req, res) => {
  try {
    const meta = await client.capabilityStatement();
    const allSupportedResources = meta.rest[0].resource.map(
      (resource: {type: string}) => resource.type
    );
    res.json(allSupportedResources);
  } catch (err: any) {
    res.status(err.response.status).json(err);
  }
});

// GET all supported operations for a resource
router.get(
  '/meta/resources/:type',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {type} = req.params as {type: string};
      const resourceType =
        type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      const meta = await client.capabilityStatement();
      const resource = meta.rest[0].resource.find(
        (resource: {type: string}) => resource.type === resourceType
      );
      res.json(resource);
    } catch (err: any) {
      // res.status(err.response.status).json(err);
      next(err);
    }
  }
);

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

router.post(
  '/resource/transaction',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {body} = req;
      // const resourceType =
      //   body.resourceType.charAt(0).toUpperCase() +
      //   body.resourceType.slice(1).toLowerCase();
      const resource = await client.transaction({
        body,
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

const opConsultNoteBundling = async () => {
  const patient = await client.search({
    resourceType: 'Patient',
    searchParams: {
      _id: '1',
    },
  });
  const practitioner = await client.search({
    resourceType: 'Practitioner',
    searchParams: {
      _id: '103',
    },
  });
  let encounter = await client.search({
    resourceType: 'Encounter',
    searchParams: {
      _id: '1',
    },
  });
  if (!encounter) {
    // create an encounter
    encounter = await client.create({
      resourceType: 'Encounter',
      body: {
        resourceType: 'Encounter',
        status: 'finished',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'ambulatory',
        },
        subject: {
          reference: `Patient/${patient.entry[0].resource?.id}`,
        },
        entry: [
          {
            reference: `Condition/${patient.entry[0].resource?.id}`,
          },
        ],
        participant: [
          {
            type: [
              {
                coding: [
                  {
                    system:
                      'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                    code: 'ADM',
                    display: 'admitter',
                  },
                ],
              },
            ],
            individual: {
              reference: `Practitioner/${practitioner.entry[0].resource?.id}`,
            },
          },
        ],
        period: {
          start: new Date().toISOString(),
        },
      },
    });
  }
  // let composition = await client.read({
  //   resourceType: 'Composition',
  //   id: '1',
  // });
  // create a composition
  // const composition: any = await client.create({
  //   resourceType: 'Composition',
  //   body: {
  //     resourceType: 'Composition',
  //     status: 'final',
  //     type: {
  //       coding: [
  //         {
  //           system: 'http://loinc.org',
  //           code: '11488-4',
  //           display: 'Consult note',
  //         },
  //       ],
  //     },
  //     subject: {
  //       reference: `Patient/${patient.entry[0].resource?.id}`,
  //     },
  //     date: new Date().toISOString(),
  //     // encounter: {
  //     //   reference: `Encounter/${encounter.entry[0].resource?.id}`,
  //     // },
  //     author: [
  //       {
  //         reference: `Practitioner/${practitioner.entry[0].resource?.id}`,
  //       },
  //     ],
  //     entry: [
  //       {
  //         reference: 'Encounter/dummy',
  //       },
  //     ],
  //     title: 'Consult note',
  //     relatesTo: [
  //       {
  //         code: 'replaces',
  //         targetIdentifier: {
  //           system: 'http://example.org/fhir/NamingSystem/document-ids',
  //           value: '12345',
  //         },
  //       },
  //     ],
  //     section: [
  //       {
  //         title: 'Reason for Referral',
  //         text: {
  //           status: 'generated',
  //         },
  //       },
  //       {
  //         title: 'History of Present Illness',
  //         text: {
  //           status: 'generated',
  //         },
  //       },
  //       {
  //         title: 'Past Medical History',
  //         text: {
  //           status: 'generated',
  //         },
  //       },
  //       {
  //         title: 'Social History',
  //         text: {
  //           status: 'generated',
  //         },
  //       },
  //       {
  //         title: 'Family History',
  //         text: {
  //           status: 'generated',
  //         },
  //       },
  //       {
  //         title: 'Review of Systems',
  //         text: {
  //           status: 'generated',
  //         },
  //       },
  //       {
  //         title: 'Physical Exam',
  //         text: {
  //           status: 'generated',
  //         },
  //       },
  //       {
  //         title: 'Assessment and Plan',
  //         text: {
  //           status: 'generated',
  //         },
  //       },
  //     ],
  //   },
  // });

  // console.log('composition', composition);
  const bundle: any = {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: [
      {
        fullUrl: patient.entry[0].fullUrl,
        resource: patient.entry[0].resource,
        request: {
          method: 'GET',
          url: `Patient/${patient.entry[0].resource?.id}`,
        },
      },
      {
        fullUrl: practitioner.entry[0].fullUrl,
        resource: practitioner.entry[0].resource,
        request: {
          method: 'GET',
          url: `Practitioner/${practitioner.entry[0].resource?.id}`,
        },
      },
      // {
      //   fullUrl: encounter.entry[0].fullUrl,
      //   resource: encounter.entry[0].resource,
      //   request: {
      //     method: 'PUT',
      //     url: `Encounter/${encounter.entry[0].resource?.id}`,
      //   },
      // },
      // {
      //   // fullUrl: composition.entry[0].fullUrl,
      //   resource: 'Composition',
      //   request: {
      //     method: 'PUT',
      //     url: `Composition/${109}`,
      //   },
      // },
    ],
  };
  return bundle;
};

router.get(
  '/op-consult-note-bundling',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bundle = await opConsultNoteBundling();
      const opConsultNoteBundle = await client.transaction({
        body: bundle as any,
      });
      res.status(200).json(opConsultNoteBundle);
    } catch (err: any) {
      // res.status(err.response.status).json(err);
      next(err);
    }
  }
);

export default router;
