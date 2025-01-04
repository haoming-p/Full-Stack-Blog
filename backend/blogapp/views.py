from django.shortcuts import render
from .serializers import UpdateUserProfileSerializer, UserInfoSerializer, UserRegistrationSerializer, BlogSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Blog
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model

@api_view(['POST'])
def register_user(request):
    serializer = UserRegistrationSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print("Serializer Errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_blog(request):
    user = request.user
    serializer = BlogSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author = user)
        return Response(serializer.data)
    print("Validation Errors:", serializer.errors) 
    print("Received Data:", request.data) 
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#@api_view(['GET'])
#def blog_list(request):
#    blogs = Blog.objects.all()
#    serializer = BlogSerializer(blogs, many=True)
#    return Response(serializer.data)

# blog detail page
@api_view(['GET'])
def get_blog(request, slug):
    blog = Blog.objects.get(slug=slug)
    serializer = BlogSerializer(blog)
    return Response(serializer.data)

# update blog
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_blog(request, pk):
    user = request.user
    blog = Blog.objects.get(id = pk)
    if blog.author != user:
        return Response({'error': 'you are not the author of this blog'}, status=status.HTTP_403_FORBIDDEN)
    serializer = BlogSerializer(blog, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# delete blog
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_blog(request, pk):
    user = request.user
    blog = Blog.objects.get(id = pk)
    if blog.author != user:
        return Response({'error': 'you are not the author of this blog'}, status=status.HTTP_403_FORBIDDEN)
    blog.delete()
    return Response({'message': 'blog deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    

# update user profile
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    serializer = UpdateUserProfileSerializer(user, data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# paginate
class BlogListPagination(PageNumberPagination):
    page_size = 6
    
@api_view(['GET'])
def blog_list(request):
    blogs = Blog.objects.all()
    paginator =  BlogListPagination()
    paginated_blogs = paginator.paginate_queryset(blogs, request)
    print(f"Paginated Blogs: {paginated_blogs}") 
    print(f"Request Query Params: {request.query_params}")  
    serializer = BlogSerializer(paginated_blogs, many=True)
    return paginator.get_paginated_response(serializer.data)

# get username
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_username(request):
    user = request.user
    username = user.username
    return Response({"username": username})

# get userinfo
@api_view(['GET'])
def get_userinfo(request, username):
    User = get_user_model()
    user = User.objects.get(username=username)
    serializer = UserInfoSerializer(user)
    return Response(serializer.data)