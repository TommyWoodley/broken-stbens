<div align="center">
  <a href="https://www.scientia.doc.ic.ac.uk">
    <img src="public/assets/logo-adaptive.svg" height="96">
    <div align="center">
      <h3>Scientia</h3>
    </div>
  </a>
  <h4 align="center">A Unified DoC EdTech Platform</h4>
  <p align="center">Spearheaded by [DoC EdTech](https://edtech.pages.doc.ic.ac.uk/), Scientia enhances the remote learning experience for staff and students.</p>
</div>

# Tech Stack and architecture

* 🛠 [nvm](https://github.com/nvm-sh/nvm) for managing different Node versions [recommended]
* Node 16
* React & Typescript for the baseline
* [Radix UI](https://www.radix-ui.com/) for unstyled accessible components
* [Stitches](https://stitches.dev/) for styling
* [Bootstrap Icons](https://icons.getbootstrap.com/) for... well, icons
* [Yarn](https://yarnpkg.com/) for dependency management


An overview of the application's architecture can be found in the [wiki's home page](https://gitlab.doc.ic.ac.uk/edtech/scientia/-/wikis/home).

# Contributing to the code

Contributions to the project are encouraged. Contribution guidelines can be found [here](CONTRIBUTING.md).

# Running the app in dev

> Make sure that the project folder sits next to the [Materials](https://gitlab.doc.ic.ac.uk/edtech/materials), [Emarking](https://gitlab.doc.ic.ac.uk/edtech/emarking) and [ScientiaAPI](https://gitlab.doc.ic.ac.uk/edtech/scientia-api) project folders.

First, install the project dependencies:

```shell
nvm use 16  # To use Node 16
yarn install
```

To make sure that cookies are sent correctly from the backend and stored correctly in the client, we use a docker-compose
stack with an Nginx reverse proxy (pretty much what we use in production -just with simpler configs).

```shell
docker compose -f dev.docker-compose.yml up [--build]
docker exec $(docker ps -qf "name=materials" | head -n1) flask drop_all
docker exec $(docker ps -qf "name=materials" | head -n1) flask create_all
docker exec $(docker ps -qf "name=materials" | head -n1) flask setup_clean_dev_env
docker exec $(docker ps -qf "name=emarking" | head -n1) flask drop_all
docker exec $(docker ps -qf "name=emarking" | head -n1) flask create_all
docker exec $(docker ps -qf "name=emarking" | head -n1) flask setup_clean_dev_env
```

The stack so-composed (pardon the pun) should allow for hot-reload in both Scientia and Materials (as the respective services' source codes are attached as volumes).
The only caveat is for the NGINX configuration: on changing it, you should also reload NGINX:

```shell
docker exec $(docker ps -qf "name=proxy" | head -n1) nginx -s reload
```

## Dev users

You can access the application with the following users:

* `hpotter` and `rweasley` - students
* `adumble` - staff

Passwords are not checked in dev, so any string is a valid password for any of the above.

Users enabled for access in dev are defined in the following places:

* [`app/mocks/ldap_authentication.py`](https://gitlab.doc.ic.ac.uk/edtech/materials/-/blob/master/app/mocks/ldap_authentication.py) in **Materials**;
* [`app/mocks/ldap_authentication.py`](https://gitlab.doc.ic.ac.uk/edtech/emarking/-/blob/master/app/mocks/ldap_authentication.py) in **Emarking**;
* [`app/dev_upstream_services/ldap_authentication.py`](https://gitlab.doc.ic.ac.uk/edtech/scientia-api/-/blob/master/app/dev_upstream_services/ldap_authentication.py) in the **Gateway API**.

These files, which provide a mock LDAP access directory, must be kept in sync with one another to allow access of dev users across the whole stack.

## Dev data

Example/dev data is provided at two different levels:

* microservice-specific data (i.e. for Materials or Emarking) - this is inserted into the corresponding database via executing `setup_clean_dev_env` ([see above](https://gitlab.doc.ic.ac.uk/edtech/scientia#running-the-app-in-dev));
* central departmental data (which would be provided by the ABC API) - this data is hardcoded in the [fake ABC API handler defined in the Gateway API](https://gitlab.doc.ic.ac.uk/edtech/scientia-api/-/blob/master/app/dev_upstream_services/abc_api_service.py).

All the current dev data refers to academic year 2021-2022.
Semantic consistency (e.g. relevancy to the same academic year) across all of the dev data must be retained. This is currently done manually.

# Working with the APIs

| API | Docs in local | Authentication |
| ------ | ------ | -------- |
| Gateway (a.k.a. Scientia API) | <localhost:8080/api> | JSON Web Tokens |
| Materials | <localhost:8080/materials> | Basic |
| Emarking | <localhost:8080/emarking> | Basic |

Should you need to contact the microservices' APIs, you may do so via GUI apps like POSTman or via CLI with `cURL` or [`httpie`](https://httpie.io/docs/cli) (recommended). For example, to get all the available teaching resources available to `hpotter` for year 2021-2022:

```shell
http -a hpotter:p :8080/materials/resources year==2122
```

The above performs basic auth for `hpotter` against this URL: <localhost:8080/materials/resources?year=2122>. 

# Running tests locally

After `yarn install`, go for `yarn test`.
