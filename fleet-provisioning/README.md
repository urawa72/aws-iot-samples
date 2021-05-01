## fleet provisioning sample code

CreateKeysAndCertificate
```
$ npx ts-node index.ts \
--endpoint xxxxxxxxxxxx-ats.iot.ap-northeast-1.amazonaws.com \
--ca_file AmazonRootCA1.pem \
--cert xxxxxxxxxx-certificate.pem.crt \
--key xxxxxxxxxx-private.pem.key \
--template_name es-test-template-1619822789101 \
--template_parameters '{"SerialNumber": "11111"}'
```
