(** Step to migrate backend/setup.sh:
- Step 1: (independent)
  + Check `Cargo.toml`
  + Check `.env`: if it is missing, check for `.env.example`.
    if `.env.example` exists, copy it to `.env`
*)
let check backend_dir =
  let cargo_toml_path = Filename.concat backend_dir "Cargo.toml" in
  let env_path = Filename.concat backend_dir ".env" in
  let env_example_path = Filename.concat backend_dir ".env.example" in
  let result =
    {
      Types.phase_name = "Backend Initial Checks";
      success = true;
      errors = [];
      warnings = [];
      details = [];
    }
  in

  (* Check `cargo.toml` *)
  Logs.info (fun m -> m "Checking for Cargo.toml at %s" cargo_toml_path);
  let result =
    if not (Utils.file_exists cargo_toml_path) then (
      Logs.err (fun m -> m "Cargo.toml not found.");
      Errors.add_phase_error result "Cargo.toml not found in backend directory."
    ) else
      result
  in

  (* Check `.env` *)
  Logs.info (fun m -> m "Checking for .env at %s" env_path);
  let result =
    if not (Utils.file_exists env_path) then (
      Logs.warn (fun m -> m ".env file not found. Checking for .env.example.");
      if Utils.file_exists env_example_path then
        match Utils.copy_file env_example_path env_path with
        | Ok () ->
            Logs.info (fun m -> m "Copied .env.example to .env");
            Errors.add_phase_warning result
              ".env file not found. Copied from .env.example."
        | Error msg ->
            Logs.err (fun m -> m "Failed to copy .env.example to .env: %s" msg);
            Errors.add_phase_error result
              (Fmt.str "Failed to copy .env.example to .env: %s" msg)
      else (
        Logs.err (fun m -> m ".env.example not found.");
        Errors.add_phase_error result
          ".env file not found and .env.example is also missing."
      )
    ) else
      result
  in

  if result.success then
    Ok (Errors.add_detail result "Cargo.toml and .env files found.")
  else
    Error result
