pipeline{
   agent any
   environment {
        TAG = sh(returnStdout: true, script: "git describe --tags --abbrev=0").trim()
    }
    stages{
        stage("Build"){   
            steps{
                sh "docker build -t 38.242.195.64:7000/buswebapp:${TAG} -f dockerfile.production ."
                sh "docker tag 38.242.195.64:7000/buswebapp:${TAG} 38.242.195.64:7000/buswebapp:latest"
            }
        }

        stage("Push to Registry"){
            steps{
                sh "docker push 38.242.195.64:7000/buswebapp:latest"
                sh "docker push 38.242.195.64:7000/buswebapp:${TAG}"
            }
        }
    }
    post{
        always{
            sh "docker rmi -f 38.242.195.64:7000/buswebapp:${TAG} 38.242.195.64:7000/buswebapp:latest"
        }
    }
}

