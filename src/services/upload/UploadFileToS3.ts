export const UploadMediaToS3 = (data: any = {}) => {
  const { url, mediaType, mediaFile } = data;
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", mediaType);
    myHeaders.append("x-amz-acl", "public-read");
    const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: mediaFile,
      redirect: "follow",
    };
    fetch(url, requestOptions)
      .then((response) => {
        return resolve(response);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};
