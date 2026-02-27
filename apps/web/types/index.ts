export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

export interface ChatThread {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export type CategoryId = "create" | "explore" | "code" | "learn"
