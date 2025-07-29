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

            const zip = new JSZip();
            zip.file('medical-image.jpg', imageBlob);

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, 'medical-images.zip');
          },
        },
      },
      defaultContext: 'VIEWER',
    };
  },
};