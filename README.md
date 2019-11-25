# Ralph

![GH workflow build badge](https://github.com/lendi-au/Ralph/workflows/Build/badge.svg)

Ralph is a CLI tool that automates security incident response for AWS resources.

It's the tool you use when this happens:
![Ralph](./img/ralph.jpg "Ralph")

## Features

Ralph loads and executes a collection of pre-defined runbook to automate incident response.

### EC2 Runbooks

1. Removing IAM Instance Profile - Detaches the current IAM Instance Profile of an instance.

2. Enable Termination Protection - Enables termination protection for an instance. This gives an extra step to prevent accidental termination of an instance.

3. Set Shutdown Behavior to Stop - Setting shutdown behavior to stop guarantees that the shutting down the instance will not result to termination of the instance.

## Installation

To install Ralph using NPM, run:

```lang=bash
$ npm i @lendi/ralph
/usr/local/bin/ralph -> /usr/local/lib/node_modules/@lendi/ralph/lib/index.js
+ @lendi/ralph@1.0.3
added 125 packages from 126 contributors in 7.843s
```

See <https://www.npmjs.com/package/@lendi/ralph>.

## Setup

- Setup your AWS credentials (`~/.aws/credentials`) by following this [guide](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html).

- Add AWS_REGION in your environment variables. Here's an example with AWS_REGION set to "ap-southeast-2":

```lang=bash
$ export AWS_REGION="ap-southeast-2"
...
```

## Usage

### `execute` command

- Runs each of the runbooks on selected AWS instance
- Loads the list of instances available for lock down.

```lang=bash
$ ralph execute
? Which instance do you want to lock down?
  i-00000000000000001 (kafka-instance)
  i-00000000000000002
  i-00000000000000003
❯ i-00000000000000004 (vulnerable-instance)
  i-00000000000000005 (machine-learning-instance)
  i-00000000000000006
  i-00000000000000007
(Move up and down to reveal more choices)
```

```lang=bash
? Which instance do you want to lock down? i-00000000000000004(vulnerable-instance)

{"level":30,"time":1574209361754,"pid":20037,"hostname":"","msg":"RemoveIamInstanceProfile: This will disassociate the following Iam Instance Profiles: ['arn:aws:iam::000000000000:instance-profile/SampleIamInstanceProfile'] for i-00000000000000004","v":1}
{"level":30,"time":1574209361870,"pid":20037,"hostname":"","msg":"setShutdownBehaviorToTerminate: The attribute instanceInitiatedShutdownBehavior will be changed from 'terminate' to 'stop' for i-00000000000000004.","v":1}
{"level":30,"time":1574209361987,"pid":20037,"hostname":"","msg":"enableTerminationProtection: The attribute disableApiTermination will be changed from false to true for i-00000000000000004.","v":1}
```

```lang=bash
? Do you want to proceed with the changes? Yes

{"level":30,"time":1574209377228,"pid":20037,"hostname":"","msg":"Disassociated IAM Instance Profile for i-00000000000000004.","v":1}
{"level":30,"time":1574209377413,"pid":20037,"hostname":"","msg":"Changed shutdown behavior to stop for i-00000000000000004.","v":1}
{"level":30,"time":1574209377547,"pid":20037,"hostname":"","msg":"Changed termination protection to true for i-00000000000000004.","v":1}
```

## Upcoming Features

- Retrieving EBS snapshots and exporting to separate AWS account for quarantine.

- Security Groups / VPC Lockdown

- Retrieving EC2 Memory Acquisition and export options

- Use more user-friendly logger
