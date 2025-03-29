export const post_recive = `#!/bin/sh
echo "Executing post-receive script. (Located in the --bare repo's hooks folder.)"

# Instructions:
# Put this file into your .git/hooks folder and set as executable

#- for Windows (attrib +x pre-commit)
#- for ubuntu (chmod +x pre-commit)

DEPLOYDIR=../repo # The place to deploy to.
BRANCH="master"

read oldrev newrev ref

# Only auto-deploy (checkout) the $BRANCH specified above.
if [[ $ref = refs/heads/$BRANCH ]];
then
  echo "Branch $ref received. Deploying \${BRANCH} branch to \\"$DEPLOYDIR\\" folder."
  git --work-tree=$DEPLOYDIR checkout -f
  echo "Done."
else
     echo "Branch $ref received. Doing nothing: only the \${BRANCH} branch may be auto-deployed to the \\"$DEPLOYDIR\\" folder."
fi`
