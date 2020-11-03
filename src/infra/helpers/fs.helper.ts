import fs from 'fs'

const FsHelper = {
  removeDir(dir: string): void {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
      if (files.length > 0) {
        files.forEach(function (file) {
          const path = `${dir}/${file}`
          fs.statSync(path).isDirectory()
            ? FsHelper.removeDir(path)
            : fs.unlinkSync(path)
        })
      }
      fs.rmdirSync(dir)
    }
  }
}

export default FsHelper
