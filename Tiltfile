docker_compose("./docker-compose.yml")
docker_build('insurance-policies/http-service', './http-service/', live_update = [
  sync('./http-service', '/app'),
  run('npm i', trigger='package.json'),
  restart_container()
])
