'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faHistory, faPaperPlane, faUserFriends } from '@fortawesome/free-solid-svg-icons';

export default function HomePage() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div>
      {/* Hero section */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">Preserve Your Legacy for Future Generations</h1>
              <p className="lead text-secondary mb-4">
                Secure, organize, and share your memories, documents, and wishes with loved ones.
                The complete digital estate planning solution.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => navigateTo('/auth/register')}
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  onClick={() => navigateTo('/about')}
                >
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <img 
                  src="/images/hero-image.png" 
                  alt="Digital Legacy Planning" 
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features section */}
      <section className="py-5 bg-white">
        <Container className="py-4">
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Why Choose LifeLegacy?</h2>
              <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>
                Our platform makes it easy to preserve what matters most and share it with those you love.
              </p>
            </Col>
          </Row>
          
          <Row>
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm border-0 p-3">
                <Card.Body className="text-center">
                  <div className="text-primary mb-3">
                    <FontAwesomeIcon icon={faShieldAlt} size="3x" />
                  </div>
                  <Card.Title className="fw-bold">Secure Storage</Card.Title>
                  <Card.Text>
                    All your documents and memories are encrypted and stored securely.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm border-0 p-3">
                <Card.Body className="text-center">
                  <div className="text-primary mb-3">
                    <FontAwesomeIcon icon={faHistory} size="3x" />
                  </div>
                  <Card.Title className="fw-bold">Memory Preservation</Card.Title>
                  <Card.Text>
                    Record your life stories and memories for future generations.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm border-0 p-3">
                <Card.Body className="text-center">
                  <div className="text-primary mb-3">
                    <FontAwesomeIcon icon={faPaperPlane} size="3x" />
                  </div>
                  <Card.Title className="fw-bold">Easy Sharing</Card.Title>
                  <Card.Text>
                    Share your legacy items with family and loved ones effortlessly.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm border-0 p-3">
                <Card.Body className="text-center">
                  <div className="text-primary mb-3">
                    <FontAwesomeIcon icon={faUserFriends} size="3x" />
                  </div>
                  <Card.Title className="fw-bold">Family Collaboration</Card.Title>
                  <Card.Text>
                    Collaborate with family members to build your shared history.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA section */}
      <section className="py-5 bg-light">
        <Container className="py-4">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h2 className="display-6 fw-bold mb-4">Ready to Preserve Your Legacy?</h2>
              <p className="lead mb-4">
                Join thousands of others who are using LifeLegacy to document their life stories and secure their digital legacy.
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                className="px-5" 
                onClick={() => navigateTo('/auth/register')}
              >
                Start For Free
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
