export default {
  env: 'test',
  db: 'mongodb://localhost:27018/skin-api-test',
  port: 3000,
  jwt: {
    client_secret: 'da4aqWjpVYALtGFN7V7XkGXCh32',
    client_id: 'skin-api-dev',
    duration: '1 day',
    sample: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJpZCI6IjU3N2M2YmRmYjQ2OTIyNjAyMGIxNWRiZCI' +
      'sImlhdCI6MTQ2Nzg3MDY3OCwiZXhwIjo0NjIzNjMwNj' +
      'c4LCJhdWQiOiJza2luLWFwaS1kZXYifQ.ZJFSmre5gZ' +
      'qlugLUfFPhWZHt30pqTm_UdMGbd1U0tCo'
  }
};
