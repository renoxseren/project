/*
  # AI Learning System Tables

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `user_message` (text)
      - `ai_response` (text)
      - `created_at` (timestamp)
      - `embedding` (vector)
      - `topics` (text[])
      
    - `knowledge_base`
      - `id` (uuid, primary key)
      - `topic` (text)
      - `content` (text)
      - `source` (text)
      - `confidence` (float)
      - `created_at` (timestamp)
      - `last_used` (timestamp)
      - `use_count` (integer)
      - `embedding` (vector)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_message text NOT NULL,
  ai_response text NOT NULL,
  created_at timestamptz DEFAULT now(),
  embedding vector(512),
  topics text[],
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Knowledge base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  content text NOT NULL,
  source text,
  confidence float DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz DEFAULT now(),
  use_count integer DEFAULT 0,
  embedding vector(512),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users" ON conversations
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON knowledge_base
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON knowledge_base
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_embedding ON conversations 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_knowledge_embedding ON knowledge_base 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_knowledge_topic ON knowledge_base (topic);
CREATE INDEX IF NOT EXISTS idx_knowledge_last_used ON knowledge_base (last_used);