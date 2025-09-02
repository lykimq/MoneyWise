(** Step to migrate backend/setup.sh:
    - Step 1: (independent)

    + Check `Cargo.toml`
    + Check `.env`: if it is missing, check for `.env.example`. if
      `.env.example` exists, copy it to `.env` *)
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
  let result =
    if not (Utils.file_exists cargo_toml_path) then (
      Logs.err (fun m -> m "Cargo.toml not found");
      Errors.add_phase_error result
        (Errors.format_not_found "Cargo.toml" " in backend directory"))
    else result
  in

  (* Check `.env` *)
  let result =
    if not (Utils.file_exists env_path) then
      if Utils.file_exists env_example_path then (
        match Utils.copy_file env_example_path env_path with
        | Ok () ->
            Logs.info (fun m -> m "Copied .env.example to .env");
            Errors.add_phase_warning result
              (Errors.format_not_found ".env file" ", copied from .env.example")
        | Error msg ->
            Logs.err (fun m -> m "Failed to copy .env.example to .env: %s" msg);
            Errors.add_phase_error result
              (Errors.format_failed "Copy .env.example to .env" msg))
      else (
        Logs.err (fun m -> m ".env.example not found");
        Errors.add_phase_error result
          (Errors.format_not_found ".env file"
             " and .env.example is also missing"))
    else result
  in

  if result.success then
    Errors.add_detail result "Cargo.toml and .env files found"
  else result
