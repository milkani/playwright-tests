pipeline {
    agent any
 
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
 
    tools {
        nodejs 'NodeJS-20'
    }
 
    environment {
        BROWSER = 'chromium'
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
                    sh 'npm install'
                    sh 'npx playwright install'
                    echo "Installing system dependencies for browsers..."
                    sh '''
                        # Try to install dependencies, but don't fail if it's not available
                        apt-get update && apt-get install -y \
                            libnss3 \
                            libnspr4 \
                            libgconf-2-4 \
                            libatk1.0-0 \
                            libatk-bridge2.0-0 \
                            libcups2 \
                            libdrm2 \
                            libxkbcommon0 \
                            libxcomposite1 \
                            libxdamage1 \
                            libxext6 \
                            libxfixes3 \
                            libxrandr2 \
                            libgbm1 \
                            libpango-1.0-0 \
                            libpangocairo-1.0-0 || echo "Note: Some system dependencies may already be installed"
                    '''
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