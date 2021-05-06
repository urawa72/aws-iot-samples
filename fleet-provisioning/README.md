## fleet provisioning sample code

CreateKeysAndCertificate
```
$ npx ts-node index.ts \
--endpoint xxxxxxxxxxxx-ats.iot.ap-northeast-1.amazonaws.com \
--ca_file AmazonRootCA1.pem \
--cert xxxxxxxxxx-certificate.pem.crt \
--key xxxxxxxxxx-private.pem.key \
--template_name <template name> \
--template_parameters '{"SerialNumber": "11111"}'
```

CreateCertificateFromCsr
```
$ openssl genrsa 2048 > my-device-private.pem.key
$ openssl req -new -key my-device-private.pem.key > my-device.csr

$ npx ts-node index.ts \
--endpoint xxxxxxxxxxxx-ats.iot.ap-northeast-1.amazonaws.com \
--ca_file AmazonRootCA1.pem \
--cert xxxxxxxxxx-certificate.pem.crt \
--key xxxxxxxxxx-private.pem.key \
--template_name <template name> \
--template_parameters '{"SerialNumber": "22222"}' \
--csr_file my-device.csr
```
