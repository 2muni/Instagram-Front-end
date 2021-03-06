export function dateSplit(str, y, m, d) {
  let date = str.split(' ')[0].split('-');
  return(
    date[0]+y+' '+date[1]+m+' '+date[2]+d
  )
}

export function dataURLToBlob(dataURL) {
  const BASE64_MARKER = ";base64,";

  // base64로 인코딩 되어있지 않을 경우
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    const parts = dataURL.split(",");
    const contentType = parts[0].split(":")[1];
    const raw = parts[1];
    return new Blob([raw], {
      type: contentType
    });
  }
  // base64로 인코딩 된 이진데이터일 경우
  const parts = dataURL.split(BASE64_MARKER);
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  // atob()는 Base64를 디코딩하는 메서드
  const rawLength = raw.length;
  // 부호 없는 1byte 정수 배열을 생성 
  const uInt8Array = new Uint8Array(rawLength); // 길이만 지정된 배열
  let i = 0;
  while (i < rawLength) {
    uInt8Array[i] = raw.charCodeAt(i);
    i++;
  }
  return new Blob([uInt8Array], {
    type: contentType
  });
};

export function resize(size, imageData, isAvatar=false) {
  const resize_image = (image) => {
    const parts = image.src.split(";base64,");
    const contentType = parts[0].split(":")[1];

    let canvas = document.createElement("canvas");
    var max_size = size;
    if(isAvatar){
      var width = max_size;
      var height = max_size;
    }else {
      var width = image.width;
      var height = image.height;
  
      if (width > height && width > max_size) {
        height *= max_size / width;
        width = max_size;
      } else if(height > max_size) {
        width *= max_size / height;
        height = max_size;
      }
    }
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(image, 0, 0, width, height);
    return canvas.toDataURL(contentType);
  }

  return dataURLToBlob(resize_image(imageData))
}

