(** Project verification command module for MoneyWise CLI *)

open Cmdliner
open Orchestrator

(** Project verification command implementation *)
let verify_cmd =
  let doc = "Verify the MoneyWise project structure and prerequisites" in
  let man =
    [
      `S Manpage.s_description;
      `P "Verifies the MoneyWise project structure and prerequisites:";
      `P "1. Checks required directories and files exist";
      `P "2. Verifies all required tools and dependencies are installed";
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
      (* Use the appropriate level function based on requested level *)
      let log_fn = Utils.get_log_function level in
      log_fn (fun m -> m "🔍 Setting log level to: %s" level_str)
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

    Utils.log_at_current_level
      (Printf.sprintf "🚀 Starting verification for project root: %s" root);

    let code = run_verification_code root in

    (* Log the verification completion - use requested level *)
    Utils.log_at_current_level
      (Printf.sprintf "🏁 Verification completed with exit code: %d" code);

    Stdlib.exit code
  in
  Cmd.v
    (Cmd.info "verify" ~doc ~man)
    Term.(const verify $ project_root $ log_level)
