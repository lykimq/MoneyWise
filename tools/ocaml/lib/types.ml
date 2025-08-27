(** Core types for MoneyWise tools *)

(** Environment configuration *)
type environment = {
  database_url : string;
  supabase_url : string;
  supabase_anon_key : string;
  rust_log : string;
  host : string;
  port : int;
  redis_url : string option;
}

(** Database schema information *)
type table_info = {
  table_name : string;
  table_columns : column_info list;
  table_constraints : constraint_info list;
}

and column_info = {
  column_name : string;
  data_type : string;
  is_nullable : bool;
  default_value : string option;
  is_primary_key : bool;
}

and constraint_info = {
  constraint_name : string;
  constraint_type : string;
  constraint_columns : string list;
  referenced_table : string option;
  referenced_columns : string list;
}

(** Service status *)
type service_status = {
  service_name : string;
  is_running : bool;
  port : int option;
  pid : int option;
  health_check : health_status;
}

and health_status =
  | Healthy
  | Unhealthy of string
  | Unknown

(** Prerequisite check result *)
type prerequisite_check = {
  check_name : string;
  is_available : bool;
  version : string option;
  path : string option;
  error_message : string option;
}

(** Project structure validation *)
type project_structure = {
  backend_dir : string;
  frontend_dir : string;
  scripts_dir : string;
  config_dir : string;
  is_valid : bool;
  missing_dirs : string list;
}

(** API response wrapper *)
type 'a api_response = {
  success : bool;
  data : 'a option;
  error : string option;
  status_code : int;
}

(** Database operation result *)
type db_operation_result = {
  operation : string;
  success : bool;
  affected_rows : int option;
  error : string option;
  execution_time_ms : float;
}

(** Configuration file locations *)
let config_paths = [
  ".env";
  "config.yaml";
  "config.yml";
  "moneywise.yaml";
  "moneywise.yml";
]

(** Default environment values *)
let default_environment = {
  database_url = "";
  supabase_url = "";
  supabase_anon_key = "";
  rust_log = "info";
  host = "127.0.0.1";
  port = 3000;
  redis_url = None;
}

(** Required tables for MoneyWise *)
let required_tables = [
  "category_groups";
  "categories";
  "budgets";
  "transactions";
  "accounts";
  "users";
]

(** Required commands for prerequisites *)
let required_commands = [
  ("git", "Git version control");
  ("node", "Node.js runtime");
  ("npm", "Node package manager");
  ("rustc", "Rust compiler");
  ("cargo", "Rust package manager");
  ("psql", "PostgreSQL client");
  ("redis-cli", "Redis client");
]

(** Helper functions for type conversion *)
let string_of_health_status = function
  | Healthy -> "Healthy"
  | Unhealthy msg -> "Unhealthy: " ^ msg
  | Unknown -> "Unknown"

let health_status_of_string = function
  | "Healthy" -> Healthy
  | "Unknown" -> Unknown
  | s -> Unhealthy s
