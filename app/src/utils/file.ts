// eslint-disable-next-line import/prefer-default-export
export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function onFileLoad() {
      if (typeof this.result === 'string' || this.result === null) {
        throw Error('Unable to read file')
      } else {
        resolve(this.result)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
