import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * @namespace
 * @description OHIF Extension for downloading the acvtive viewport image and metadata as a zip file.
 * This extension adds a custom mode with a toolbar to trigger the download.
 */
export default {
  id: 'download-image-extension',
  /**
   * Returns the commands module for the extension.
   * @param {object} context - The extension context, including servicesManager, commandsManager, and extensionManager.
   * @returns {object} Commands module definition.
   */
  getCommandsModule: ({ servicesManager, commandsManager, extensionManager }) => {
    return {
      definitions: {
        /**
         * Exports the current viewport image as JPEG and metadata as JSON in a ZIP file.
         * @async
         * @returns {Promise<void>}
         */
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