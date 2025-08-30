(** Project verification command module for MoneyWise CLI *)

open Cmdliner
open Orchestrator

(** Project verification command implementation *)
let verify_cmd =
  let doc = "Verify the MoneyWise project structure and prerequisites" in
  let man =
    [ `S Manpage.s_description
    ; `P "Verifies the MoneyWise project structure and prerequisites:"
    ; `P "1. Checks required directories and files exist"
    ; `P "2. Verifies all required tools and dependencies are installed"
    ; `S Manpage.s_examples
    ; `P "$(mname) verify"
    ; `P "$(mname) verify --project-root /path/to/project" ]
  in
  let project_root =
    let doc = "Project root directory" in
    Arg.(value & opt (some dir) None & info ["project-root"] ~docv:"DIR" ~doc)
  in
  let verify project_root : unit =
    let root =
      match project_root with
      | Some dir ->
          dir
      | None -> (
        match Sys.getenv_opt "PROJECT_ROOT" with
        | Some v ->
            v
        | None ->
            let current = Unix.getcwd () in
            if Filename.basename current = "tools" then Filename.dirname current
            else current )
    in
    let code = run_verification_code root in
    Stdlib.exit code
  in
  Cmd.v (Cmd.info "verify" ~doc ~man) Term.(const verify $ project_root)
