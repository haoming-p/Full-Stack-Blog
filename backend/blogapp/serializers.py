from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Blog

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'password'] # default
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def create(self, validated_data):
        username=validated_data['username']
        first_name=validated_data['first_name']
        last_name=validated_data['last_name']
        password = validated_data['password']

        user = get_user_model()
        new_user = user.objects.create(username=username,first_name=first_name, last_name=last_name)
        new_user.set_password(password)
        new_user.save()
        return new_user

class SimpleAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id','username','first_name','last_name','profile_picture', "user_tag"]

class BlogSerializer(serializers.ModelSerializer):
    author = SimpleAuthorSerializer(read_only=True)
    class Meta:
        model = Blog
        fields = ['id','title','slug','author','category','content','featured_image','published_date','created_at','updated_at','is_draft']


class UpdateUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'bio', "user_tag",
                  'profile_picture', 'linkedin', 'facebook', 'instagram'] 
        

class UserInfoSerializer(serializers.ModelSerializer):
    author_posts = serializers.SerializerMethodField()
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "first_name", "last_name", "bio", "user_tag","profile_picture", "author_posts"]

    
    def get_author_posts(self, user):
        blogs = Blog.objects.filter(author=user)[:9]
        serializer = BlogSerializer(blogs, many=True)
        return serializer.data