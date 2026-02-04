pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.50.0-noble'
            args '-u root:root'
        }
    }

    parameters {
        string(
            name: 'TEST_FILE',
            defaultValue: 'tests',
            description: 'Test file or folder to run (e.g., tests, tests/authorization.spec.ts)'
        )
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        BROWSER = 'chromium'
        HOME = '/root'
    }

    stages {
        stage('Cleanup') {
            steps {
                script {
                    echo "Cleaning up previous build artifacts..."
                    sh '''
                        rm -rf playwright-report
                        rm -rf test-results
                        rm -rf node_modules
                    '''
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    echo "Checking out code..."
                    checkout scm
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "Installing npm dependencies..."
                    sh 'npm ci'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo "Running Playwright tests: ${params.TEST_FILE} with ${BROWSER} browser..."
                    sh '''
                        npx playwright test ${TEST_FILE} --project=${BROWSER}
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "Publishing Playwright HTML Report..."
            publishHTML(
                target: [
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true
                ]
            )
            junit 'test-results/**/*.xml'
        }

        failure {
            echo "Tests failed. Check the Playwright Report for details."
        }

        success {
            echo "All tests passed successfully!"
        }

        unstable {
            echo "Build is unstable. Some tests may have failed."
        }

        cleanup {
            deleteDir()
        }
    }
}
