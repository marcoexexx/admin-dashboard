type TableColumnHeader<T> = {
  id: keyof T | "actions"
  name: string
  align?: "left" | "right" | "center" | "justify"
}
