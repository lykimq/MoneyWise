(** Step to migrate backend/setup.sh:
    - Step 1: (independent)

    + Check `Cargo.toml`
    + Check `.env`: if it is missing, check for `.env.example`. if
      `.env.example` exists, copy it to `.env`

    - Step 2: Environment Parsing and Database Detection (depend on step 1)

    + Read the `.env` to understand about the database environment
    + Parse `.env` and get the `DATABASE_URL`
    + Detech database type: localhost, or supabase?

    - Step 3: Core Build and Migration (depend on 2)

    + Install SQLx CLI: check `sqlx` command is available. If not install it.
    + Run Database Migrations: `sqlx migrate run` within the backend folder.
    + Build the project: `cargo build` in the backend folder.

    ----- Service and Database Management These steps handle the "stateful"
    parts of the environment, such as runnning services, verifying the database
    state. They can be implemented after the core logic is working.

    - Step 4: Local Service Management (Depend on step 2)

    + Condition Execution: only run this step if the database type from Step 2
      is `local`
    + Start PostgreSQL: Execute the system command to start the PostgreSQL
      service.
    + Start Redis: Execute the system command to start the Redis service.

    - Step 5: Database Verification (Depend on step 3 and 4) Perfom checks to
      ensure the database is correctly set up and the connection is working.

    + Test connection: ++ For `Supabase`, verify the connection to the remote
      database. ++ For `Local`, verify the connection to the local PostgreSQL
      instance.
    + Verify Schema: Implement a basic schema check (e.g., query for the
      existence of a key table created by the migrations.) Depend on step 3, and
      for a local setup, the service must be running (step 4)

    ---- Post-Setup Enhancements

    This final setp is a "nice-to-have" that confirms the running application is
    working correctly.

    Step 6: Live Server Health Check (Depend on step 3) Briefly start the
    backend server and test its main API endpoints to confirm the build was
    successful and the server can run.
    + Start Server: Run `cargo run`
    + Health Check: After a short delay, use an OCaml HTTP client library to
      make requests to `http://localhost:3000/api/bugets/overview` and other key
      endpoints.
    + Stop Server: Terminate the background server process after the checks are
      complete. *)

let setup_backend root_dir =
  Logs.info (fun m -> m "🚀 Phase 4: Backend Setup");
  let backend_dir = Filename.concat root_dir "moneywise-backend" in
  let initial_phase_result = Results.initial_phase_result "Backend Setup" in

  Logs.info (fun m -> m "Step 1: Checking backend prerequisites...");
  let step1_result = Phase4_backend_step1_checks.check backend_dir in

  let final_result =
    match step1_result with
    | Ok result ->
        Logs.info (fun m -> m "Step 1: successful");
        {
          initial_phase_result with
          success = result.success;
          details = result.details;
          warnings = result.warnings;
        }
    | Error err ->
        Logs.err (fun m -> m "Step 1 failed");
        {
          initial_phase_result with
          success = false;
          errors = err.errors;
          details = err.details;
        }
  in
  final_result
