let checks backend_dir =
  let steps =
    [
      ( "Step 1: Initial Checks",
        fun () -> Phase4_backend_step1_checks.check backend_dir );
      ( "Step 2: Check database DATABSE_URL",
        fun () -> Phase4_backend_step2_database_verify.check backend_dir );
      (* TODO: Add Step 2: Database Setup *)
      (* TODO: Add Step 3: Dependencies Installation *)
      (* TODO: Add Step 4: Configuration Validation *)
    ]
  in

  let rec run_steps steps =
    match steps with
    | [] -> Ok []
    | (_name, step_fun) :: rest -> (
        match step_fun () with
        | Ok result -> (
            match run_steps rest with
            | Ok results -> Ok (result :: results)
            | Error err -> Error err)
        | Error err -> Error err)
  in

  run_steps steps
