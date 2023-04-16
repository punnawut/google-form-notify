function genMS()
{
  var form = FormApp.openById('xxx'); //Replace your form id 
  var formRes = form.getResponses();
  var formResponse = formRes[formRes.length - 1];
  var itemResponses = formResponse.getItemResponses();

  var textData = '\n';
  var imgThumbnail = [];
  var records = []
  for (var i = 0; i < itemResponses.length; i++) {
    var type = itemResponses[i].getItem().getType();
    var count = i+1;
    var title = itemResponses[i].getItem().getTitle();
    if(type == "GRID"){
      var row = itemResponses[i].getItem().asGridItem().getRows();
      var val = itemResponses[i].getResponse().toString().split(",");
      textData += `${count}) ${title} : \n`;
      for(var j = 0; j < row.length; j++){
        textData += ' - ' + row[j] + ' : ' + val[j] + '\n';
      } 
    }
    else if(type == "FILE_UPLOAD"){
      var imageIds = itemResponses[i].getResponse().toString().split(',');
      if(imageIds.length > 1){
        textData += `${count}) ${title}:\n`;
        imageIds.forEach(function(val,index){
          imgThumbnail[0] = `https://drive.google.com/uc?export=view&id=${val}`;
          textData += `${count}.${index+1}) ${imgThumbnail[0]}\n`;
        })
      }else{
        imgThumbnail[0] = 'https://drive.google.com/uc?export=view&id=' + imageIds;
        textData += `${count}) ${title}: ${imgThumbnail[0]}\n`;
      }
    }
    else{
      var text = itemResponses[i].getResponse();
      textData += `${count}) ${title} : ${text}\n`;
      records.push(text);
    }
  }
  sendMS(textData,imgThumbnail);
}

function sendMS(text,picture)
{
  var formData = {
    'message': text,
    'imageThumbnail': picture[0],
    'imageFullsize': picture[0],
  };
  var token = 'xxx'; //Replace your LINE token id here
  
  var options = {
    'method' : 'post',
    'headers' : {'Authorization': "Bearer "+token},
    'contentType': 'application/x-www-form-urlencoded',
    'payload' : formData
  };
  UrlFetchApp.fetch('https://notify-api.line.me/api/notify', options);
}