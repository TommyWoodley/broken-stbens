# Contributing to the project

To contribute to the source code of Scientia project:
1. Create an issue on the project's issue page, describing the motivation for the change you propose i.e. a problem you have
encountered or a feature you wish to introduce. You can alternatively pick an
issue already listed on the *Issues* page;
2. Assign the issue to yourself;
3. Fork the project (**occasional contributor**) or create a branch (**project developer**);
4. Code code code;
5. Issue a [merge
request](https://docs.gitlab.com/ee/workflow/forking_workflow.html), referencing
the issue in step (1) by copying the reference from the bottom of the right
sidebar on the *Issues* page.

Please be sure to rebase your work on top of the latest commit on the master
branch.
Each merge request will be reviewed by the EdTech team before being integrated into the repo's master branch.

The source code is open for contribution to staff members and students.
**Respect the project and the collaborators**: constructive feedback on the code is encouraged, as well as knowledge-sharing about
latest practices/features/libraries in comments (pertinent to the piece of code
the comments refer to, clearly); offences of any kind, e.g. *insulting other collaborators' code or
exploiting the code in a malicious way*, will result in the offender(s) being banned from the repository and sent
alone at night to the Forbidden Forest to collect unicorns' manure.

## General Development Conventions

### Branching conventions (for non-occasional contributors)
Branch names should follow the following format:
```
<issue number>-<title>
```
where *title* should match as closely as possible that of the GitLab issue identified by *issue number*.
> For branches created to implement code not related to a particular issue, replace the issue number with your college login e.g. ip914-configuration-upgrades

### Commit formatting 

A commit-message linter and the Prettier code formatter are automatically run on each commit. As far as the commit message is concerned:

- it should start with a tag identifying the type of commit. Valid tags are: `Feat`, `Docs`, `Style`, `Tests`, `Fix`, `Refactor`, `Chore`, `Build`;
- it should be no longer that 100 chars;
- it should NOT end with a dot.

Violations of the above will make the linter fail (with an obvious message).

Example of valid commit messages:

```
Feat: Show commit hash for LabTS submissions
Fix: Add check to prevent dereferencing on null value
```


### Development
Before issuing a merge request, make sure that:
- if you have added a new functionality, you have also added reasonable tests to define the intent and expected behaviour of the code you wrote;
- your code complains to basic ES10 guidelines. These includes, among others:
    - orthodox spacing and indentation;
    - upper-case constants;
    - CamelCase for names (JS);
- Your merge request presents a clear description of how your code adds value to the application.
