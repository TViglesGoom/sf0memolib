# CouchDB Single Node Server

refs:
  - https://github.com/apache/couchdb-docker
  - https://docs.couchdb.org/en/latest/setup/single-node.html
  - (bonus) cluster setup: https://docs.couchdb.org/en/stable/setup/cluster.html

<!--couchdb: (for docker-compose)
  image: docker.io/bitnami/couchdb:3-debian-10
  environment:
    - COUCHDB_PASSWORD=${COUCH_PASSWORD}
    # COUCHDB_NODENAME: A server alias for clustering support. Default: couchdb@127.0.0.1
    # COUCHDB_PORT_NUMBER: Standard port for all HTTP API requests. Default: 5984
    # COUCHDB_CLUSTER_PORT_NUMBER: Port for cluster communication. Default: 9100
    # COUCHDB_BIND_ADDRESS: Address binding for the standard port. Default: 0.0.0.0
    # COUCHDB_CREATE_DATABASES: If set to yes, during the first initialization of the container the system databases will be created. Default: yes
    # COUCHDB_USER: The username of the administrator user when authentication is enabled. Default: admin
    # COUCHDB_PASSWORD: The password to use for login with the admin user set in the COUCHDB_USER environment variable. Default: couchdb
    # COUCHDB_PASSWORD_FILE: Path to a file that contains the password for the custom user set in the COUCHDB_USER environment variable. This will override the value specified in COUCHDB_PASSWORD. No defaults.
    # COUCHDB_SECRET: The secret token for Proxy and Cookie Authentication. If it is not specified, it will be randomly generated. No defaults.
    # COUCHDB_SECRET_FILE: Path to a file that contains the contents of the secret parameter for CouchDB. This will override the value specified in COUCHDB_SECRET. No defaults.
  ports:
    # tcp	Standard clustered port for all HTTP API requests
    - ${COUCH_API_PORT}:5984
    # tcp	Erlang port mapper daemon (epmd)
    - '${COUCH_EPMD_PORT}:4369'
    # tcp	Communication with other CouchDB nodes in the cluster
    - '${COUCH_CLUSTER_PORT}:9200'
  volumes:
    - couchdb_data:/bitnami/couchdb-->


## Configuration

CouchDB
- configuration: https://docs.couchdb.org/en/stable/config/index.html
- backups: https://docs.couchdb.org/en/latest/maintenance/backups.html

## Connecting to and usage examples

```bash
# couch:create JSON
curl -H 'Content-Type: application/json' \
-X POST http://admin:example@127.0.0.1:5984/memos-port \
-d '{"title": "Example, Inc."}'

# couch:read ID
curl -X GET http://admin:example@127.0.0.1:5984/memos-port/b2aaeffe7330387602e3b24875001ad4
```
