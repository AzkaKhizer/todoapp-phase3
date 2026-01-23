/**
 * API type definitions for the Todo application.
 */

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  is_complete: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  limit: number;
  offset: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface MessageResponse {
  message: string;
}

// Request types
export interface UserCreateRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
}

export interface TaskUpdateRequest {
  title: string;
  description: string;
}

export interface TaskPatchRequest {
  title?: string;
  description?: string;
  is_complete?: boolean;
}

// ============================================================
// Chat Types
// ============================================================

/**
 * Request body for POST /api/chat
 */
export interface ChatRequest {
  /** User's message (1-2000 characters) */
  message: string;
  /** Optional conversation ID to continue existing conversation */
  conversation_id?: string;
}

/**
 * Response from POST /api/chat
 */
export interface ChatResponse {
  /** AI assistant's response message */
  message: string;
  /** Conversation ID (created or existing) */
  conversation_id: string;
}

/**
 * Single message in a conversation
 */
export interface ChatMessage {
  /** UUID of the message */
  id: string;
  /** Role: 'user' or 'assistant' */
  role: "user" | "assistant";
  /** Message content */
  content: string;
  /** ISO timestamp of creation */
  created_at: string;
}

/**
 * Conversation summary (for list view)
 */
export interface Conversation {
  /** UUID of the conversation */
  id: string;
  /** Title (first message preview or null) */
  title: string | null;
  /** ISO timestamp of creation */
  created_at: string;
  /** ISO timestamp of last update */
  updated_at: string;
}

/**
 * Response from GET /api/chat/conversations
 */
export interface ConversationListResponse {
  /** List of conversations */
  conversations: Conversation[];
  /** Total count */
  total: number;
}

/**
 * Response from GET /api/chat/conversations/{id}
 */
export interface ConversationDetailResponse {
  /** UUID of the conversation */
  id: string;
  /** Title (first message preview or null) */
  title: string | null;
  /** All messages in the conversation */
  messages: ChatMessage[];
  /** ISO timestamp of creation */
  created_at: string;
  /** ISO timestamp of last update */
  updated_at: string;
}

/**
 * Local message for optimistic UI (before server confirms)
 */
export interface LocalChatMessage extends ChatMessage {
  /** Pending status for optimistic updates */
  status?: "pending" | "sent" | "error";
}
