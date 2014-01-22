//
//  VideoPlugin.h
//  YY
//
//  Created by wonliao on 13/6/7.
//
//
#import <Cordova/CDV.h>

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <CoreVideo/CoreVideo.h>
#import <CoreMedia/CoreMedia.h>
#import "UIImage+MostColor.h"


@interface VideoPlugin : CDVPlugin <AVCaptureVideoDataOutputSampleBufferDelegate> {
    NSString* m_imageStr;
    
    UIImage *m_img;
    UIColor *m_mostColor;
}

- (void)echo:(CDVInvokedUrlCommand*)command;
- (void)echoThreading:(CDVInvokedUrlCommand*)command;
- (void)startVideo:(CDVInvokedUrlCommand*)command;
- (void)stopVideo:(CDVInvokedUrlCommand*)command;
- (void)getVideoImage:(CDVInvokedUrlCommand*)command;
- (void)setVideoImage:(CDVInvokedUrlCommand*)command;

@property (nonatomic, strong) AVCaptureSession *captureSession;
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) CALayer *customLayer;
@property (nonatomic, strong) AVCaptureVideoPreviewLayer *prevLayer;
@property (nonatomic, strong) UIColor *mostColor;


@end

