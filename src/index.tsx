import JSZip from 'jszip';
import { saveAs } from 'file-saver';
export default {
  id: 'download-image-extension',

  getCommandsModule: ({ servicesManager, commandsManager, extensionManager }) => {
    return {
      definitions: {
        exportZip: {
          commandFn: async () => {
            console.log('Export zip command executed');


            const { viewportGridService, displaySetService, cornerstoneViewportService } = servicesManager.services;

            const viewportId = viewportGridService.getActiveViewportId();
            const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);

            const canvas = viewportInfo.element.querySelector('canvas');

            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            const imageBlob = await (await fetch(imageDataUrl)).blob();
            const displaySets = displaySetService.getActiveDisplaySets();
            const displaySetInstanceUID = displaySets[0]?.displaySetInstanceUID;
            console.log('Display Set Instance UID:', displaySetInstanceUID);


            const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);

            console.log(displaySet);

            const patientName =
              displaySet?.instances?.[0]?.PatientName?.[0]?.Alphabetic ||
              'Unknown';
            const rawDate = displaySet?.instances?.[0]?.StudyDate || 'Unknown';


            console.log('Patient Name:', patientName);
            console.log('Study Date:', rawDate);
            const studyDate = rawDate
              ? `${rawDate.slice(0, 4)}/${rawDate.slice(4, 6)}/${rawDate.slice(6, 8)}`
              : 'Unknown';

            const metadata = {
              patientName,
              studyDate,
            };
            const metadataJson = JSON.stringify(metadata, null, 2);

            const zip = new JSZip();
            zip.file('image.jpg', imageBlob);
            zip.file('metadata.json', metadataJson);

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, 'medical-images.zip');




          },
        },
      },
      defaultContext: 'VIEWER',
    };
  },
};