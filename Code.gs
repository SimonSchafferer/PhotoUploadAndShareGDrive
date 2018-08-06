var yourGMailAdress = ""

function doGet() {
  return HtmlService.createHtmlOutputFromFile('UploadForm')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function uploadFileToDrive(base64Data, fileName, folderName) {
  try{
    var splitBase = base64Data.split(','),
        type = splitBase[0].split(';')[0].replace('data:','');

    var byteCharacters = Utilities.base64Decode(splitBase[1]);
    var ss = Utilities.newBlob(byteCharacters, type);
    ss.setName(fileName);

   // var dropbox = folderName; // Folder Name
    var folder, folders = DriveApp.getFoldersByName(folderName);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    var file = folder.createFile(ss);
    // Send email
    Logger.log(Session.getActiveUser().getEmail());
    Logger.log(Session.getActiveUserLocale());
    Logger.log(Session.getEffectiveUser().getEmail());
    GmailApp.sendEmail(yourGMailAdress, "Photo Upload", "File uploaded: "+ file.getName() + " from " + Logger.getLog())
    return file.getName();
  }catch(e){
    return 'Error: ' + e.toString();
  }
}

/**
 * Get the URL for the Google Apps Script running as a WebApp.
 */
function getScriptUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}
