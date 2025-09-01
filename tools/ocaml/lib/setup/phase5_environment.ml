(** Phase 5: Environment Configuration *)

open Types
open Utils
open Results
open Errors

(** Configure environment by running setup scripts *)
let configure_environment root_dir =
  Logs.info (fun m -> m "⚙️  Phase 5: Environment Configuration");
  let result = ref (initial_phase_result "Environment Configuration") in
  let scripts_dir = Filename.concat root_dir "scripts" in
  let setup_dir = Filename.concat scripts_dir "setup" in
  (* Check if environment setup scripts exist *)
  let env_scripts =
    [
      ("get-supabase-credentials.sh", "Supabase credentials script");
      ("env-manager.sh", "Environment manager script");
    ]
  in
  (* Use env_scripts to check all scripts *)
  let check_env_script script_name description =
    let script_path = Filename.concat setup_dir script_name in
    if file_exists script_path then (
      Logs.info (fun m -> m "    ✅ %s exists" description);
      result := add_detail !result (Fmt.str "%s exists" description);
      true)
    else (
      Logs.warn (fun m -> m "    ⚠️  %s not found (will be skipped)" description);
      result := add_phase_warning !result (Fmt.str "%s not found" description);
      false)
  in
  (* Check each script from the env_scripts list *)
  let script_status =
    List.map
      (fun (script_name, description) ->
        let exists = check_env_script script_name description in
        (script_name, description, exists))
      env_scripts
  in
  (* Execute environment setup scripts if they exist *)
  List.iter
    (fun (script_name, description, exists) ->
      if exists then (
        let script_path = Filename.concat setup_dir script_name in
        let action =
          if
            String.contains script_name 's'
            && String.contains script_name 'u'
            && String.contains script_name 'p'
          then "Setting up Supabase credentials"
          else "Configuring environment variables"
        in
        Logs.info (fun m -> m "    🔑 %s..." action);
        if make_executable script_path then
          let exit_code =
            execute_command_in_dir setup_dir ("./" ^ script_name)
          in
          if exit_code = 0 then (
            Logs.info (fun m -> m "    ✅ %s completed successfully" description);
            result :=
              add_detail !result
                (Fmt.str "%s completed successfully" description))
          else (
            Logs.warn (fun m ->
                m "    ⚠️  %s had issues (exit code: %d)" description exit_code);
            result :=
              add_phase_warning !result
                (Fmt.str "%s had issues (exit code: %d)" description exit_code))
        else (
          Logs.warn (fun m ->
              m "    ⚠️  Failed to make %s executable" description);
          result :=
            add_phase_warning !result
              (Fmt.str "Failed to make %s executable" description))))
    script_status;
  (* Mark phase as completed if no critical errors *)
  if !result.errors = [] then result := { !result with success = true };
  Logs.info (fun m ->
      m "  Phase 5 completed: %d/%d checks passed"
        (if !result.errors = [] then 1 else 0)
        1);
  !result
