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
  getCommandsModule: ({ servicesManager }) => {
    return {
      definitions: {
        exportZip: {
          commandFn: async () => {
            const { viewportGridService, displaySetService, cornerstoneViewportService } = servicesManager.services;

            // Gets the viewport ID of the active viewport and the viewport information.
            const viewportId = viewportGridService.getActiveViewportId();
            const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);

            // Checks if the viewport is ready and has an element before converting it into an image blob
            const canvas = viewportInfo.element.querySelector('canvas');
            const imageBlob: Blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));

            // Retrieves the currently active display sets, extracts the instance UID of the first display set,
            // and fetches the full display set object using that UID.

            const displaySets = displaySetService.getActiveDisplaySets();
            const displaySetInstanceUID = displaySets[0]?.displaySetInstanceUID;
            const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);

            // Used to access metadata (e.g., PatientName, StudyDate) for the active image.
            const rawPatientName =
              displaySet?.instances?.[0]?.PatientName?.[0]?.Alphabetic || 'Unknown';
            const rawDate = displaySet?.instances?.[0]?.StudyDate || 'Unknown';
            // Was getting the PatientName in the format "Doe^John" and needed to convert it to "John, Doe".
            const patientName = rawPatientName.replace('^', ', ');


            const studyDate = rawDate && rawDate.length === 8
              ? `${rawDate.slice(6, 8)}/${rawDate.slice(4, 6)}/${rawDate.slice(0, 4)}`
              : 'Unknown';

            // Converts the metadata into a JSON object and prepares it for zipping.
            const metadata = { patientName, studyDate };
            const metadataJson = JSON.stringify(metadata, null, 2);

            // Creates a zip file containing the image blob and metadata JSON.
            const zip = new JSZip();
            zip.file('image.jpg', imageBlob);
            zip.file('metadata.json', metadataJson);

            // Generates the zip file as a Blob and triggers the download using FileSaver.js.
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, 'medical-images.zip');
          },
        },
      },
      defaultContext: 'VIEWER',
    };
  },
};