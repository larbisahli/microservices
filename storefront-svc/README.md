# Database Diagram

![](db-schema-diagram.png)

# AWS Architecture

![](architecture-diagram.png)


## gRPC SSL
1- Generate the CA private key:
You first need to generate a private key for your CA. This key should be kept extremely secure.

`openssl genpkey -algorithm RSA -out ca.key`

This command generates a RSA private key and saves it to the file 'ca.key'.

2- Generate the CA certificate:
Next, generate a self-signed certificate for your CA using the private key from the previous step.

`openssl req -x509 -new -nodes -key ca.key -sha256 -days 1024 -out ca.crt
`

This command creates a new X.509 certificate request, signs it using the CA's private key, and outputs the certificate to 'ca.crt'. The certificate is valid for 1024 days.

3- Generate the server private key:
Now generate a private key for your server.

`openssl genpkey -algorithm RSA -out server.key`

4- Generate the server certificate signing request (CSR):
You need to create a certificate signing request for your server. The CSR includes information like the common name (CN), which in this case should be the hostname of your server.

`openssl req -new -key server.key -out server.csr`

This command creates a new CSR for the server using the server's private key and outputs it to 'server.csr'. You'll be prompted to enter some information, including the common name (CN). For a server certificate, the CN should be the server's hostname.

5- Sign the server CSR with the CA certificate:
Now use your CA to sign the server's CSR, which creates the server certificate.

`openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 500 -sha256
`

This command takes the server CSR and the CA certificate and key, and outputs the signed server certificate to 'server.crt'. The certificate is valid for 500 days.

6- Generate the client private key:
Generate a private key for your client in a similar way to the server private key.

`openssl genpkey -algorithm RSA -out client.key
`

7- Generate the client CSR:
Create a CSR for your client. The common name can be anything you like; it's common to use the client's username or hostname.

`openssl req -new -key client.key -out client.csr
`

8- Sign the client CSR with the CA certificate:
Use your CA to sign the client's CSR, which creates the client certificate.

`openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 500 -sha256
`

Now we have the necessary certificates and keys: 'ca.crt', 'server.crt', 'server.key', 'client.crt', and 'client.key'.

Remember that private keys ('ca.key', 'server.key', 'client.key') should be kept secure.

## Postgres
- RLS
- Prepare statements
- MATERIALIZED VIEW


`sudo EDITOR=nano crontab -e`

Check ssl_renew logs

`tail -f /var/log/cron.log`

https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose
https://www.digitalocean.com/community/tutorials/how-to-manage-logfiles-with-logrotate-on-ubuntu-16-04


// CURRENCY
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat

https://gist.github.com/ksafranski/2973986

------------

alias
tenant
user_account
store
store_view

# docker stats --no-stream

# https://phoenixnap.com/kb/docker-memory-and-cpu-limit

https://www.section.io/engineering-education/data-encryption-and-decryption-in-node-js-using-crypto/