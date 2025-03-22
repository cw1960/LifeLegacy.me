'use client';

import React from 'react';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import { Container, Row, Col, Card } from 'react-bootstrap';

export default function LoginPage() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <Card className="glass-card">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <Link href="/" className="text-decoration-none d-inline-block">
                  <span className="visually-hidden">LifeLegacy - Home</span>
                  <h1 className="fs-2 fw-bold">
                    <span className="text-primary">Life</span>
                    <span style={{ color: '#0369a1' }}>Legacy</span>
                  </h1>
                </Link>
                <h2 className="mt-3 fs-4 fw-semibold gradient-text">
                  Welcome back
                </h2>
                <p className="mt-2 text-secondary fs-6">
                  Sign in to your account to manage your digital legacy
                </p>
              </div>
              
              <LoginForm />
              
              <div className="mt-4 text-center">
                <p className="text-secondary fs-6">
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/register" className="text-primary text-decoration-none fw-medium">
                    Sign up
                  </Link>
                </p>
                <p className="text-secondary fs-6 mt-2">
                  <Link href="/auth/forgot-password" className="text-primary text-decoration-none fw-medium">
                    Forgot your password?
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
} 