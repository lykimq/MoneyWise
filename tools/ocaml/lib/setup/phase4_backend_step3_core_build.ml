(** - Step 3: Core Build and Migration (depend on 2)

    + Install SQLx CLI: check `sqlx` command is available. If not install it.
    + Run Database Migrations: `sqlx migrate run` within the backend folder.
    + Build the project: `cargo build` in the backend folder. *)

let run_command_and_report_result ~phase_name ~dir ~command ~success_msg
    ~failure_msg ~details_success_msg : Types.phase_result =
  Output.print_section phase_name;
  Logs.info (fun m -> m "Executing: %s in %s" command dir);
  let exit_code = Utils.execute_command_in_dir dir command in
  if exit_code = 0 then (
    Logs.info (fun m -> m "%s ✅" success_msg);
    {
      phase_name;
      success = true;
      errors = [];
      warnings = [];
      details = [ details_success_msg ];
    })
  else (
    Logs.err (fun m -> m "%s ❌" failure_msg);
    {
      phase_name;
      success = false;
      errors = [ failure_msg ];
      warnings = [];
      details = [];
    })

let try_install_sqlx_with_version version =
  let command =
    Printf.sprintf
      "cargo install sqlx-cli@%s --no-default-features --features \
       rustls,sqlite,postgres"
      version
  in
  let exit_code = Utils.execute_command_in_dir "." command in
  exit_code = 0

let try_install_sqlx_locked () =
  let command =
    "cargo install sqlx-cli --no-default-features --features \
     rustls,sqlite,postgres --locked"
  in
  let exit_code = Utils.execute_command_in_dir "." command in
  exit_code = 0

let update_rust_and_install_sqlx () =
  Logs.info (fun m -> m "Attempting to update Rust toolchain...");
  let update_exit_code =
    Utils.execute_command_in_dir "." "rustup update stable"
  in
  if update_exit_code = 0 then (
    Logs.info (fun m -> m "Rust updated successfully. Installing sqlx-cli...");
    let command =
      "cargo install sqlx-cli --no-default-features --features \
       rustls,sqlite,postgres"
    in
    let exit_code = Utils.execute_command_in_dir "." command in
    exit_code = 0)
  else (
    Logs.warn (fun m -> m "Failed to update Rust toolchain");
    false)

let check_and_install_sqlx_cli () : Types.phase_result =
  let phase_name = "Install SQLx CLI" in
  Output.print_section ("Checking and " ^ phase_name);
  Logs.info (fun m -> m "Checking if sqlx CLI is installed...");
  let check_command = "command -v sqlx" in
  let exit_code = Utils.execute_command_in_dir "." check_command in
  if exit_code = 0 then (
    Logs.info (fun m -> m "SQLx CLI is already installed. ✅");
    {
      phase_name;
      success = true;
      errors = [];
      warnings = [];
      details = [ "SQLx CLI is already installed." ];
    })
  else (
    Logs.warn (fun m ->
        m "SQLx CLI not found. Trying multiple installation approaches...");

    (* Try compatible versions first *)
    let compatible_versions = [ "0.7.4"; "0.7.3"; "0.7.2" ] in
    let rec try_versions = function
      | [] -> false
      | version :: rest ->
          Logs.info (fun m ->
              m "Trying to install sqlx-cli version %s..." version);
          if try_install_sqlx_with_version version then (
            Logs.info (fun m ->
                m "Successfully installed sqlx-cli version %s" version);
            true)
          else (
            Logs.warn (fun m ->
                m "Failed to install version %s, trying next..." version);
            try_versions rest)
    in

    if try_versions compatible_versions then
      {
        phase_name;
        success = true;
        errors = [];
        warnings = [];
        details = [ "SQLx CLI installed successfully (compatible version)." ];
      }
    else if try_install_sqlx_locked () then
      {
        phase_name;
        success = true;
        errors = [];
        warnings = [];
        details = [ "SQLx CLI installed successfully with --locked flag." ];
      }
    else if update_rust_and_install_sqlx () then
      {
        phase_name;
        success = true;
        errors = [];
        warnings = [];
        details = [ "SQLx CLI installed successfully after Rust update." ];
      }
    else (
      Logs.err (fun m -> m "All SQLx CLI installation methods failed. ❌");
      {
        phase_name;
        success = false;
        errors =
          [
            "Failed to install SQLx CLI. Possible solutions:";
            "1. Update Rust: rustup update stable";
            "2. Use a specific version: cargo install sqlx-cli@0.7.4";
            "3. Check your internet connection and cargo registry access";
          ];
        warnings = [];
        details = [];
      }))

let run_database_migrations backend_dir : Types.phase_result =
  let migrations_path = Filename.concat backend_dir "database/migrations" in
  run_command_and_report_result ~phase_name:"Run Database Migrations"
    ~dir:backend_dir
    ~command:(Printf.sprintf "sqlx migrate run --source %s" migrations_path)
    ~success_msg:"Database migrations ran successfully."
    ~failure_msg:"Failed to run database migrations."
    ~details_success_msg:"Database migrations ran successfully."

let build_backend_project backend_dir : Types.phase_result =
  run_command_and_report_result ~phase_name:"Build Backend Project"
    ~dir:backend_dir ~command:"cargo build"
    ~success_msg:"Backend project built successfully."
    ~failure_msg:"Failed to build backend project."
    ~details_success_msg:"Backend project built successfully."

let run (backend_dir : string) : Types.phase_result =
  let sqlx_cli_result = check_and_install_sqlx_cli () in
  if not sqlx_cli_result.success then sqlx_cli_result
  else
    let migrations_result = run_database_migrations backend_dir in
    if not migrations_result.success then migrations_result
    else build_backend_project backend_dir
