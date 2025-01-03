from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Blog

class CustomUserAdmin(UserAdmin):   # inherits from UserAdmin
    list_display = ('username', 'email', 'first_name', 'last_name','user_tag','bio',
                  'profile_picture', 'linkedin', 'facebook', 'instagram')
    search_fields = ('username', 'user_tag')

admin.site.register(CustomUser, CustomUserAdmin)    # Register the CustomUser Model with the Admin

class BlogAdmin(admin.ModelAdmin):
    list_display=('title','is_draft','category','created_at')
admin.site.register(Blog, BlogAdmin)