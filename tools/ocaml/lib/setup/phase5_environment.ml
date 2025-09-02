(** Phase 5: Environment Configuration *)

open Types
open Utils
open Results
open Errors

(** Configure environment by running setup scripts *)
let configure_environment root_dir =
  Logs.info (fun m -> m "⚙️  Phase 5: Environment Configuration");
  let scripts_dir = Filename.concat root_dir "scripts" in
  let setup_dir = Filename.concat scripts_dir "setup" in
  (* Check if environment setup scripts exist *)
  let env_scripts =
    [
      ("get-supabase-credentials.sh", "Supabase credentials script");
      ("env-manager.sh", "Environment manager script");
    ]
  in

  (* Check and execute scripts using functional composition *)
  let check_and_execute_script result (script_name, description) =
    let script_path = Filename.concat setup_dir script_name in
    if file_exists script_path then
      let result_with_detail =
        add_detail result (Fmt.str "%s exists" description)
      in
      if make_executable script_path then
        let exit_code = execute_command_in_dir setup_dir ("./" ^ script_name) in
        if exit_code = 0 then
          add_detail result_with_detail
            (Fmt.str "%s completed successfully" description)
        else
          add_phase_warning result_with_detail
            (Fmt.str "%s had issues (exit code: %d)" description exit_code)
      else
        add_phase_warning result_with_detail
          (Fmt.str "Failed to make %s executable" description)
    else add_phase_warning result (Fmt.str "%s not found" description)
  in

  (* Process all scripts using functional composition *)
  let initial_result = initial_phase_result "Environment Configuration" in
  let final_result =
    List.fold_left check_and_execute_script initial_result env_scripts
  in

  (* Mark phase as completed if no critical errors *)
  if final_result.errors = [] then { final_result with success = true }
  else final_result
