export interface IAudiobookModel {
  id: string
  status: string
  createdAt: Date
  updatedAt: Date
  title: string
  description: string
  filePath: string
  tags: string[]
}
