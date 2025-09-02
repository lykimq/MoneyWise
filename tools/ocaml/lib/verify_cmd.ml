(** Project verification command implementation *)

let verify_cmd =
  let open Cmdliner in
  let doc = "Verify the MoneyWise project structure and prerequisites" in
  let man =
    [
      `S Manpage.s_description;
      `P "Verifies the MoneyWise project structure and prerequisites:";
      `P "1. Checks required directories and files exist";
      `P "2. Verifies all required tools and dependencies are installed";
      `P "3. Sets up frontend and backend components";
      `P "4. Validates environment and services";
      `S "PHASES";
      `P "Available phases:";
      `P "  • Phase 1: Project Structure Verification";
      `P "  • Phase 2: Prerequisites Check";
      `P "  • Phase 3: Frontend Setup";
      `P "  • Phase 4: Backend Setup (with steps 1-2)";
      `P "  • Phase 5: Environment Setup";
      `P "  • Phase 6: Services Setup";
      `P "  • Phase 7: Final Validation";
      `S "STEPS";
      `P "Available steps for Phase 4:";
      `P "  • Step 1: Backend Initial Checks";
      `P "  • Step 2: Database Environment Verification";
      `S Manpage.s_examples;
      `P "$(mname) verify";
      `P "$(mname) verify --project-root /path/to/project";
      `P "$(mname) verify --log-level=debug";
    ]
  in
  let project_root =
    let doc = "Project root directory" in
    Arg.(value & opt (some dir) None & info [ "project-root" ] ~docv:"DIR" ~doc)
  in
  let log_level =
    let doc = "Set the log level (app, info, warning, error, debug)" in
    Arg.(value & opt string "info" & info [ "log-level" ] ~docv:"LEVEL" ~doc)
  in
  let verify project_root log_level : unit =
    (* Set up logging based on the provided level *)
    let setup_logs level_str =
      let level =
        match level_str with
        | "app" -> Logs.App
        | "info" -> Logs.Info
        | "warning" -> Logs.Warning
        | "error" -> Logs.Error
        | "debug" -> Logs.Debug
        | _ -> Logs.Info (* Default to info if invalid level *)
      in
      (* Initialize Fmt_tty for proper terminal output *)
      Fmt_tty.setup_std_outputs ();
      Logs.set_level (Some level);
      Logs.info (fun m -> m "🔍 Setting log level to: %s" level_str)
    in
    setup_logs log_level;
    let root =
      match project_root with
      | Some dir -> dir
      | None -> (
          match Sys.getenv_opt "PROJECT_ROOT" with
          | Some v -> v
          | None ->
              let current = Unix.getcwd () in
              if Filename.basename current = "tools" then
                Filename.dirname current
              else current)
    in
    Logs.info (fun m -> m "🚀 Starting verification for project root: %s" root);
    let code = Orchestrator.run_verification_code root in
    (* Log the verification completion - use requested level *)
    Logs.info (fun m -> m "🏁 Verification completed with exit code: %d" code);
    Stdlib.exit code
  in
  Cmd.v
    (Cmd.info "verify" ~doc ~man)
    Term.(const verify $ project_root $ log_level)
