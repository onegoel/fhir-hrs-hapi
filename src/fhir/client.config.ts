import Client from 'fhir-kit-client';

const client = new Client({
  baseUrl: 'http://fhir:8080/fhir',
  customHeaders: {
    'Content-Type': 'application/fhir+json',
    Accept: 'application/fhir+json',
  },
});

export default client;
