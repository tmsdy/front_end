# init var
BUILD_TAG=`cat ~/build-tag.txt`
# stop docker
sudo docker ps | grep "registry-corp.hypereal.com/frontend/mes" | awk '{print $1}' | sudo xargs docker stop -t 1
# run new one
sudo docker login registry-corp.hypereal.com -u mesfrontend -p Dfda9_fsaD
sudo docker run -itd --name mes-frontend-${BUILD_TAG} -p 8080:80 registry-corp.hypereal.com/frontend/mes:${BUILD_TAG}