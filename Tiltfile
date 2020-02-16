docker_compose("./docker-compose.yml")
docker_build('insurance-policies/graphql-service', './graphql-service/', live_update = [
  sync('./graphql-service', '/app'),
  run('npm i', trigger='package.json'),
  restart_container()
])
