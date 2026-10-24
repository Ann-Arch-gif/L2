import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '97y5asq7',
    dataset: 'production',
  },
  deployment: {
    appId: 'd8s6ibs5wmeddzyi8crsrv7o',
    autoUpdates: true,
  },
})
