pipeline {
    agent any

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/AwashAwash/portfolio-older.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t portfolio-staging:latest .'
            }
        }

        stage('Security Scan (Trivy)') {
            steps {
                sh '''
                docker run --rm \
                  -v /var/run/docker.sock:/var/run/docker.sock \
                  aquasec/trivy:0.69.3 image \
                  --severity HIGH,CRITICAL \
                  --exit-code 0 \
                  portfolio-staging:latest
                '''
            }
        }


stage('Push Image to Docker Hub') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh '''
            docker tag portfolio-staging:latest $DOCKER_USER/portfolio-staging:latest
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $DOCKER_USER/portfolio-staging:latest
            docker logout
            '''
        }
    }
}




        stage('Test Email') {
    steps {
        emailext(
            to: 'awashmaskeyash@gmail.com',
            subject: 'Jenkins Email Test',
            body: 'Testing Jenkins email notification.',
            mimeType: 'text/plain'
        )
    }
}

        stage('Deploy Staging Container') {
            steps {
                sh '''
                docker rm -f portfolio-staging || true
                docker run -d --restart unless-stopped --name portfolio-staging -p 8082:80 portfolio-staging:latest
                '''
            }
        }
    }

    post {
        always {
            script {
                if (fileExists('trivy-report.txt')) {
                    archiveArtifacts artifacts: 'trivy-report.txt', fingerprint: true
                }
            }
        }

        success {
            emailext(
                subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build succeeded!\n\n${env.BUILD_URL}",
                to: "awashmaskeyash@gmail.com"
            )

            withCredentials([string(credentialsId: 'slack-webhook-url', variable: 'SLACK_WEBHOOK')]) {
                sh '''
                curl -X POST -H 'Content-type: application/json' \
                --data "{\\"text\\":\\"SUCCESS: Job ${JOB_NAME} Build #${BUILD_NUMBER}\\\\n${BUILD_URL}\\"}" \
                "$SLACK_WEBHOOK"
                '''
            }
        }

        failure {
            emailext(
                subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build failed!\n\n${env.BUILD_URL}",
                to: "awashmaskeyash@gmail.com"
            )

            withCredentials([string(credentialsId: 'slack-webhook-url', variable: 'SLACK_WEBHOOK')]) {
                sh '''
                curl -X POST -H 'Content-type: application/json' \
                --data "{\\"text\\":\\"FAILED: Job ${JOB_NAME} Build #${BUILD_NUMBER}\\\\n${BUILD_URL}\\"}" \
                "$SLACK_WEBHOOK"
                '''
            }
        }
    }
}
